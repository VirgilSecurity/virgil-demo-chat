package com.virgilsecurity.dynamodbdemo.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;

import com.virgilsecurity.dynamodbdemo.R;
import com.virgilsecurity.dynamodbdemo.adapter.data.MemberItem;

import java.util.List;

/**
 * Created by Andrii Iakovenko.
 */
public class MembersListAdapter extends BaseAdapter {

    private Context mContext;
    private List<MemberItem> members;

    public MembersListAdapter(Context context, List<MemberItem> memberItems){
        this.mContext = context;
        this.members = memberItems;
    }

    public MemberItem getMemberItem(int i) {
        return members.get(i);
    }

    static class ViewHolder{
        TextView textView;
        CheckBox checkBox;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) mContext
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        View mView = convertView;

        if(mView == null) {
            mView = inflater.inflate(R.layout.members_list_item, parent, false);
            //configure viewholder
            ViewHolder viewHolder = new ViewHolder();
            viewHolder.textView = (TextView)mView.findViewById(R.id.text);
            viewHolder.checkBox = (CheckBox)mView.findViewById(R.id.checkBox);

            mView.setTag(viewHolder);
        }

        ViewHolder holder = (ViewHolder)mView.getTag();

        holder.checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                MemberItem item = (MemberItem) compoundButton.getTag();
                item.setChecked(b);
            }
        });

        MemberItem item = members.get(position);

        holder.textView.setText(item.getUsername());
        holder.checkBox.setTag(item);

        return mView;
    }

    @Override
    public int getCount() {
        return members.size();
    }

    @Override
    public Object getItem(int position) {
        return null;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }
}
